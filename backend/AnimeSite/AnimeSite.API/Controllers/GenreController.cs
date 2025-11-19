using AnimeSite.Core.Abstractions;
using AnimeSite.Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace AnimeSite.API.Controllers;

public record CreateGenreRequest(string Name);

[ApiController]
[Route("api/[controller]")]
public class GenreController : ControllerBase
{
    private readonly IGenreRepository _genreRepository;
    
    public GenreController(IGenreRepository genreRepository)
    {
        _genreRepository = genreRepository;
    }

    [HttpGet]
    public async Task<ActionResult<List<Genre>>> GetAll()
    {
        var genres = await _genreRepository.GetAll();
        return Ok(genres); 
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreateGenreRequest request)
    {
        var (genre, error) = Genre.Create(
            Guid.NewGuid(), 
            request.Name
        );

        if (!string.IsNullOrEmpty(error)) return BadRequest(error);

        await _genreRepository.Add(genre);
        return Ok();
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        await _genreRepository.Delete(id);
        return Ok();
    }
}