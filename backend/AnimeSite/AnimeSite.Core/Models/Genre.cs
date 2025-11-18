namespace AnimeSite.Core.Models;

public class Genre
{
    private Genre(Guid id, string name)
    {
        Id = id;
        Name = name;
    }
    public Guid Id { get; }
    public string Name { get; }

    public static (Genre genre, string Error) Create(Guid id, string name)
    {
        var error = string.Empty;
        
        if (string.IsNullOrWhiteSpace(name))
        {
            error += "Genre name is required. ";
        }

        if (!string.IsNullOrEmpty(error))
        {
            return (null!, error.Trim());
        }
        
        var genre = new Genre(id, name);
        return (genre, error);
    }
}