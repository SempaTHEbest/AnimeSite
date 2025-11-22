using AnimeSite.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
namespace AnimeSite.DataAccess;

public class AnimeSiteDbContext : DbContext
{
    public AnimeSiteDbContext(DbContextOptions<AnimeSiteDbContext> options)
        : base(options)
    {
        
    }
    
    public DbSet<AnimeEntity> Animes { get; set; } = null!;
    public DbSet<GenreEntity> Genres { get; set; } = null!;
    public DbSet<EpisodeEntity> Episodes { get; set; } = null!;
    public DbSet<AnimeGenreEntity>  AnimeGenres { get; set; } = null!;
    public DbSet<UserEntity>  Users { get; set; } = null!;
    public DbSet<UserAnimeInteractionEntity>  Interactions { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AnimeSiteDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}