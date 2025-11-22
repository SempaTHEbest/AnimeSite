using AnimeSite.API.Contracts.Interaction;
using AnimeSite.Core.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using AnimeSite.API.Contracts;

namespace AnimeSite.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InteractionController :  ControllerBase
{
    private readonly IInteractionService _service;

    public InteractionController(IInteractionService service)
    {
        _service = service;
    }

    [HttpPost("rate")]
    public async Task<ActionResult> Rate([FromBody] RateAnimeRequest request)
    {
        var userId = GetUserId();
        try
        {
            await _service.RateAnime(userId, request.AnimeId, request.Rating);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("watch-later")]
    public async Task<ActionResult> AddToWatchLater([FromBody] WatchLaterRequest request)
    {
        var userId = GetUserId();
        await _service.AddToWatchLater(userId, request.AnimeId);
        return Ok();
    }

    [HttpDelete("watch-later/{animeId:guid}")]
    public async Task<ActionResult> RemoveFromWatchLater(Guid animeId)
    {
        var userId = GetUserId();
        await _service.RemoveFromWatchLater(userId, animeId);
        return Ok();
    }

    [HttpGet("watch-later")]
    public async Task<ActionResult<List<AnimeResponse>>> GetMyWatchList()
    {
        var userId = GetUserId();
        

        var animes = await _service.GetUserWatchLaterList(userId);
        

        var response = animes.Select(a => new AnimeResponse(
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

        return Ok(response);
    }
    
    
    //method to get userId
    private Guid GetUserId()
    {
        var idClaim =  User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (idClaim == null) throw new Exception("User not found");
        return Guid.Parse(idClaim.Value);
    }
}