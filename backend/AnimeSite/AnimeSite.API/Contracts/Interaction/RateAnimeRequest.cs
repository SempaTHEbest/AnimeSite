namespace AnimeSite.API.Contracts.Interaction;

public record RateAnimeRequest(
    Guid AnimeId,
    int Rating);