using AnimeSite.API.Contracts; // Тут лежить AnimeResumeResponse
using AnimeSite.Core.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AnimeSite.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Обов'язково: історія доступна тільки авторизованим
public class HistoryController : ControllerBase
{
    private readonly IHistoryService _service;

    public HistoryController(IHistoryService service)
    {
        _service = service;
    }

    // POST: api/history
    // Тіло запиту: "guid-id-серії" (у лапках, бо це просто Guid)
    [HttpPost]
    public async Task<ActionResult> AddToHistory([FromBody] Guid episodeId)
    {
        var userId = GetUserId();
        try 
        {
            await _service.AddToHistory(userId, episodeId);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // GET: api/history/resume
    [HttpGet("resume")]
    public async Task<ActionResult<List<AnimeResumeResponse>>> GetResumeList()
    {
        var userId = GetUserId();
        
        // Отримуємо дані з сервісу
        var historyDtos = await _service.GetResumeList(userId);

        // Мапимо (перетворюємо) в API відповідь
        var response = historyDtos.Select(h => new AnimeResumeResponse(
            h.AnimeId,
            h.AnimeTitle,
            h.AnimeImageUrl,
            h.EpisodeId,
            h.EpisodeNumber,
            h.TotalEpisodes,
            h.WatchedDate
        )).ToList();

        return Ok(response);
    }
    
    // Допоміжний метод для отримання ID юзера з токена
    private Guid GetUserId()
    {
        var idClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (idClaim == null) throw new Exception("User not found in token");
        return Guid.Parse(idClaim.Value);
    }
}