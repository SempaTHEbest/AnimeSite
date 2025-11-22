public record AnimeResponse(
    Guid Id,
    string Title,
    string Description,
    string ImageUrl,
    double Rating,
    string Studio,      
    string Status,      
    string Type,        
    DateTime ReleaseDate,
    int? TotalEpisodes  
);