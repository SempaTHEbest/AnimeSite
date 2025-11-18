namespace AnimeSite.Core.Models;

public class Episode
{
    private Episode(Guid id, string title, string summary, int seasonNumber, int episodeNumber, DateTime releaseDate, string episodeLink, Guid animeId)
    {
        Id = id;
        Title = title;
        Summary = summary;
        SeasonNumber = seasonNumber;
        EpisodeNumber = episodeNumber;
        ReleaseDate = releaseDate;
        EpisodeLink = episodeLink;
        AnimeId = animeId;
    }

    public Guid Id { get; }
    public string Title { get; }
    public string Summary { get; }      
    public int SeasonNumber { get; }     
    public int EpisodeNumber { get; }
    public DateTime ReleaseDate { get; } 
    public string EpisodeLink { get; }   
    public Guid AnimeId { get; }         
    
    public static (Episode episode, string Error) Create(Guid id, string title, string summary, int seasonNumber, int episodeNumber, DateTime releaseDate, string episodeLink, Guid animeId)
    {
        var error = string.Empty;

        if (string.IsNullOrWhiteSpace(title))
        {
            error += "Title is required. ";
        }

        if (episodeNumber < 0)
        {
            error += "Episode number cannot be negative. ";
        }

        if (!string.IsNullOrEmpty(error))
        {
            return (null!, error.Trim());
        }

        var episode = new Episode(id, title, summary, seasonNumber, episodeNumber, releaseDate, episodeLink, animeId);

        return (episode, error);
    }
}