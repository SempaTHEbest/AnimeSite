using AnimeSite.Core.Abstractions;
using AnimeSite.Core.Models;
using AnimeSite.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace AnimeSite.DataAccess.Repositories;

public class GenreRepository : IGenreRepository
{
    private readonly AnimeSiteDbContext _context;

    public GenreRepository(AnimeSiteDbContext context)
    {
        _context = context;
    }

    public async Task<List<Genre>> GetAll()
    {
        var entities = await _context.Genres
            .AsNoTracking()
            .ToListAsync();
        return entities.Select(e => MapToDomain(e)).ToList();
    }

    public async Task Add(Genre genre)
    {
        var entity = new GenreEntity
        {
            Id = genre.Id,
            Name = genre.Name,
        };
        await _context.Genres.AddAsync(entity);
        await _context.SaveChangesAsync();
    }

    public async Task Delete(Guid id)
    {
        var entity = await _context.Genres.FindAsync(id);
    }
    
    private Genre MapToDomain(GenreEntity entity)
    {
        var (genre, error) = Genre.Create(entity.Id, entity.Name);

        if (!string.IsNullOrEmpty(error))
        {
            throw new InvalidOperationException($"Genre data corruption: {error}");
        }

        return genre;
    }
}