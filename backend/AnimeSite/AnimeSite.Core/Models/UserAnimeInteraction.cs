namespace AnimeSite.Core.Models;

public class UserAnimeInteraction
{

    public UserAnimeInteraction(Guid userId, Guid animeId, int? rating, bool isWatchLater)
    {
        UserId = userId;
        AnimeId = animeId;
        Rating = rating;
        IsWatchLater = isWatchLater;
    }
    public Guid UserId { get;}
    public Guid AnimeId { get; }
    public int? Rating { get; private set; }
    public bool IsWatchLater { get; private set; }
    
    //Fabric Method 
    public static UserAnimeInteraction Create(Guid userId, Guid animeId, int? rating, bool isWatchLater)
    {
        return new UserAnimeInteraction(userId, animeId, rating, isWatchLater);
    }
    
    //method for updating rating
    public void SetRating(int rating)
    {
        if(rating<1 || rating>10) throw new ArgumentException("Rating must be between 1 and 10");
        Rating = rating;
    }
    
    //Method fot watch later
    public void SetWatchLater(bool isWatchLater)
    {
        IsWatchLater = isWatchLater;
    }
}