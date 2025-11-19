using AnimeSite.API.Contracts;
using AnimeSite.Core.Abstractions;
using AnimeSite.Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace AnimeSite.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GenreController : ControllerBase
{
    private readonly IGenreService _genreService;

    public GenreController(IGenreService genreService)
    {
        _genreService = genreService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Genre>>> GetAll()
    {
        var genres = await _genreService.GetAllGenres();
        return Ok(genres);
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreateGenreRequest request)
    {
        try
        {
            await _genreService.CreateGenre(request.Name);
            return Ok();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        await _genreService.DeleteGenre(id);
        return Ok();
    }
}