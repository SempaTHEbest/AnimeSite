using AnimeSite.Core.Models;

namespace AnimeSite.Core.Abstractions;

public interface IAnimeService
{
    Task<List<Anime>> GetAllAnimes();
    Task<Anime?> GetAnimeById(Guid id);
    Task CreateAnime(string title, string description, string imageUrl, double rating, string studio, string status, string type, DateTime releaseDate, int? totalEpisodes);
}