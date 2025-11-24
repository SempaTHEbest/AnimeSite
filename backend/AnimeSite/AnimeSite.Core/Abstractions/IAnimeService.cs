using AnimeSite.Core.Models;

namespace AnimeSite.Core.Abstractions;

public interface IAnimeService
{
    Task<(List<Anime> Items, int TotalCount)> GetAllAnimes(string? search, int page, int pageSize);
    Task<Anime?> GetAnimeById(Guid id);
    Task CreateAnime(string title, string description, string imageUrl, double rating, string studio, string status, string type, DateTime releaseDate, int? totalEpisodes);
    Task DeleteAnime(Guid id);
}