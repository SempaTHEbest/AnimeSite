namespace AnimeSite.API.Contracts;

public record CreateAnimeRequest(
    string Title,
    string Description,
    string ImageUrl,
    double Rating,
    string Studio,
    string Status,
    string Type,
    DateTime ReleaseDate,
    int? TotalEpisodes);