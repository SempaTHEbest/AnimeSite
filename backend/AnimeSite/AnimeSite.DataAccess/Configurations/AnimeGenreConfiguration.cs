using AnimeSite.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AnimeSite.DataAccess.Configurations;

public class AnimeGenreConfiguration : IEntityTypeConfiguration<AnimeGenreEntity>
{
    public void Configure(EntityTypeBuilder<AnimeGenreEntity> builder)
    {
        builder.ToTable("AnimeGenres");
        
        builder.HasKey(ag => new { ag.AnimeId, ag.GenreId });

        // Налаштування зв'язку з Anime
        builder.HasOne(ag => ag.Anime)
            .WithMany(a => a.AnimeGenres)
            .HasForeignKey(ag => ag.AnimeId);

        // Налаштування зв'язку з Genre
        builder.HasOne(ag => ag.Genre)
            .WithMany(g => g.AnimeGenres)
            .HasForeignKey(ag => ag.GenreId);

    }
}