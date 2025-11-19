using AnimeSite.API.Contracts;
using AnimeSite.Core.Abstractions;
using AnimeSite.Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace AnimeSite.API.Controllers;


[ApiController]
[Route("api/[controller]")]
public class EpisodeController : ControllerBase
{
    private readonly IEpisodeRepository _episodeRepository;

    public EpisodeController(IEpisodeRepository episodeRepository)
    {
        _episodeRepository = episodeRepository;
    }

    [HttpGet("{animeId:guid}")]
    public async Task<ActionResult<List<Episode>>> Get(Guid animeId)
    {
        var episodes = await _episodeRepository.GetByAnimeId(animeId);
        return Ok(episodes);
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreateEpisodeRequest request)
    {
        var (episode, error) = Episode.Create(
            Guid.NewGuid(),
            request.Title,
            request.Summary,
            request.SeasonNumber,
            request.EpisodeNumber,
            request.ReleaseDate,
            request.EpisodeLink,
            request.AnimeId // Беремо з JSON
        );

        if (!string.IsNullOrEmpty(error)) return BadRequest(error);

        await _episodeRepository.AddEpisode(episode);
        return Ok();
    }
}