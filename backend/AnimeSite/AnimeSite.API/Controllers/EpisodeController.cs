using AnimeSite.API.Contracts;
using AnimeSite.Core.Abstractions;
using AnimeSite.Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace AnimeSite.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EpisodeController : ControllerBase
{
    private readonly IEpisodeService _episodeService;

    public EpisodeController(IEpisodeService episodeService)
    {
        _episodeService = episodeService;
    }

    // Отримати епізоди конкретного аніме
    [HttpGet("anime/{animeId:guid}")]
    public async Task<ActionResult<List<Episode>>> GetByAnimeId(Guid animeId)
    {
        var episodes = await _episodeService.GetEpisodesByAnimeId(animeId);
        return Ok(episodes);
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreateEpisodeRequest request)
    {
        try
        {
            await _episodeService.CreateEpisode(
                request.Title,
                request.Summary,
                request.SeasonNumber,
                request.EpisodeNumber,
                request.ReleaseDate,
                request.EpisodeLink,
                request.AnimeId
            );
            
            return Ok();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}