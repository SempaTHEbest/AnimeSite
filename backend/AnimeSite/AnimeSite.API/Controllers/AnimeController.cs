using AnimeSite.API.Contracts;
using AnimeSite.Core.Abstractions; // Тут лежать інтерфейси сервісів
using AnimeSite.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AnimeSite.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnimeController : ControllerBase
{
    private readonly IAnimeService _animeService; 

    public AnimeController(IAnimeService animeService)
    {
        _animeService = animeService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResponse<AnimeResponse>>> GetAll(
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var (animes, totalCount) = await _animeService.GetAllAnimes(search, page, pageSize);
        
        var animeResponses = animes.Select(a => new AnimeResponse(
            a.Id,
            a.Title,
            a.Description,
            a.ImageUrl,
            a.Rating,
            a.Studio,
            a.Status,
            a.Type,
            a.ReleaseDate,
            a.TotalEpisodes
        )).ToList();
        
        var response = new PagedResponse<AnimeResponse>(
            animeResponses,
            totalCount,
            page,
            pageSize
        );
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Anime>> GetById(Guid id)
    {
        var anime = await _animeService.GetAnimeById(id);
        
        if (anime == null)
        {
            return NotFound();
        }
        
        return Ok(anime);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> Create([FromBody] CreateAnimeRequest request)
    {
        try
        {
            
            await _animeService.CreateAnime(
                request.Title,
                request.Description,
                request.ImageUrl,
                request.Rating,
                request.Studio,
                request.Status,
                request.Type,
                request.ReleaseDate,
                request.TotalEpisodes
            );

            return Ok();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        
        
    }
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")] 
    public async Task<ActionResult> Delete(Guid id)
    {
        try
        {
            await _animeService.DeleteAnime(id);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}