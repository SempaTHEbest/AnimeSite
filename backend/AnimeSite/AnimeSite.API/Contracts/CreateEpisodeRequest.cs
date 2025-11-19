namespace AnimeSite.API.Contracts;

public record CreateEpisodeRequest(
    string Title,
    string Summary,
    int SeasonNumber,
    int EpisodeNumber,
    DateTime ReleaseDate,
    string EpisodeLink,
    Guid AnimeId);