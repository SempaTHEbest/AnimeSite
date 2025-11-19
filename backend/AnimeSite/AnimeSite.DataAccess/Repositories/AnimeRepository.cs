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

    // 1. Отримати всі аніме
    public async Task<List<Anime>> Get()
    {
        var animeEntities = await _context.Animes
            .AsNoTracking() // Для читання це пришвидшує роботу
            .Include(a => a.AnimeGenres) // Обов'язково вантажимо зв'язки
            .ThenInclude(ag => ag.Genre)
            .ToListAsync();

        var animes = animeEntities
            .Select(a => MapToDomain(a))
            .ToList();

        return animes;
    }

    // 2. Отримати одне аніме по ID
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

    // 3. Додати нове аніме
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
            // Тут ще треба буде логіку для додавання GenreEntity, але про це окремо
        };

        await _context.Animes.AddAsync(animeEntity);
        await _context.SaveChangesAsync();
    }

    // --- ПРИВАТНИЙ МЕТОД МАПІНГУ ---
    private Anime MapToDomain(AnimeEntity entity)
    {
        // Тепер тут немає конфлікту! Просто пишемо Anime.Create
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

        // Мапимо жанри
        var genresList = new List<Genre>();
        
        // Перевірка на null, щоб не впало, якщо жанрів немає
        if (entity.AnimeGenres != null) 
        {
            foreach (var animeGenre in entity.AnimeGenres)
            {
                // Тут теж все чисто - Genre.Create
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