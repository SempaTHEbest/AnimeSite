namespace AnimeSite.API.Contracts;

public record AnimeResumeResponse(
    Guid AnimeId,
    string AnimeTitle,
    string AnimeImageUrl,
    Guid LastEpisodeId,
    int LastEpisodeNumber,
    int? TotalEpisodes,
    DateTime LastWatched
    );