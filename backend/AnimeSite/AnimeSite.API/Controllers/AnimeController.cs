using AnimeSite.API.Contracts;
using AnimeSite.Core.Abstractions;
using AnimeSite.Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace AnimeSite.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnimeController : ControllerBase
{
    private readonly IAnimeRepository _animeRepository;

    public AnimeController(IAnimeRepository animeRepository)
    {
        _animeRepository = animeRepository;
    }

    [HttpGet]
    public async Task<ActionResult<List<Anime>>> GetAll()
    {
        var animes = await _animeRepository.Get();
        return Ok(animes);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Anime>> GetById(Guid id)
    {
        var anime = await _animeRepository.GetById(id);
        if (anime == null)
        {
            return NotFound();
        }
        return Ok(anime);
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreateAnimeRequest request)
    {
        var (anime, error) = Anime.Create(
            Guid.NewGuid(), // Генеруємо новий ID тут
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

        if (!string.IsNullOrEmpty(error))
        {
            return BadRequest(error);
        }

        await _animeRepository.Add(anime);
        return Ok();
    }
    
}