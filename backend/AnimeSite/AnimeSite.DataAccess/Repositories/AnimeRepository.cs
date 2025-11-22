using AnimeSite.Core.Abstractions;
using AnimeSite.Core.Models;
using AnimeSite.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace AnimeSite.DataAccess.Repositories;

public class AnimeRepository : IAnimeRepository
{
    private readonly AnimeSiteDbContext _context;

    public AnimeRepository(AnimeSiteDbContext context)
    {
        _context = context;
    }


    public async Task<(List<Anime> Items, int TotalCount)> Get(string? search, int page, int pageSize)
    {
        var query = _context.Animes
            .AsNoTracking()
            .Include(a => a.AnimeGenres)
            .ThenInclude(ag =>  ag.Genre)
            .AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(a => a.Title.Contains(search));
        }
        
        var totalCount = await query.CountAsync();
        
        //pagination
        var animeEntities = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        
        var animes = animeEntities
            .Select(a => MapToDomain(a))
            .ToList();
        return (animes, totalCount);
    }
    
    public async Task<Anime?> GetById(Guid id)
    {
        var animeEntity = await _context.Animes
            .AsNoTracking()
            .Include(a => a.AnimeGenres)
            .ThenInclude(ag => ag.Genre)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (animeEntity == null)
        {
            return null;
        }

        return MapToDomain(animeEntity);
    }

    public async Task Add(Anime anime)
    {
        var animeEntity = new AnimeEntity
        {
            Id = anime.Id,
            Title = anime.Title,
            Description = anime.Description,
            ImageUrl = anime.ImageUrl,
            Rating = anime.Rating,
            Studio = anime.Studio,
            Status = anime.Status,
            Type = anime.Type,
            ReleaseDate = anime.ReleaseDate,
            TotalEpisodes = anime.TotalEpisodes
        };

        await _context.Animes.AddAsync(animeEntity);
        await _context.SaveChangesAsync();
    }

    public Anime MapToDomain(AnimeEntity entity)
    {
        var (anime, error) = Anime.Create(
            entity.Id,
            entity.Title,
            entity.Description,
            entity.ImageUrl,
            entity.Rating,
            entity.Studio,
            entity.Status,
            entity.Type,
            entity.ReleaseDate,
            entity.TotalEpisodes
        );

        if (!string.IsNullOrEmpty(error))
        {
            throw new InvalidOperationException(error);
        }

        var genresList = new List<Genre>();
        
        if (entity.AnimeGenres != null) 
        {
            foreach (var animeGenre in entity.AnimeGenres)
            {
                var (genre, genreError) = Genre.Create(animeGenre.Genre.Id, animeGenre.Genre.Name);
                
                if (!string.IsNullOrEmpty(genreError))
                {
                   throw new InvalidOperationException(genreError);
                }
                
                genresList.Add(genre);
            }
        }

        anime.Genres = genresList;

        return anime;
    }
}