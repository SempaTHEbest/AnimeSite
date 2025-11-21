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
    private readonly IAnimeService _animeService; // Використовуємо Сервіс

    public AnimeController(IAnimeService animeService)
    {
        _animeService = animeService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Anime>>> GetAll()
    {
        var animes = await _animeService.GetAllAnimes();
        return Ok(animes);
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
            // Просто передаємо дані в сервіс. 
            // Сервіс сам створить ID, перевірить валідацію і збереже в базу.
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
            // Якщо сервіс викинув помилку (наприклад, пуста назва), повертаємо 400 Bad Request
            return BadRequest(ex.Message);
        }
    }
}