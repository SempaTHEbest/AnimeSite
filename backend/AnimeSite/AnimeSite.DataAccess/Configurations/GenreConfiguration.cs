using AnimeSite.Core.Models;
using AnimeSite.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AnimeSite.DataAccess.Configurations;

public class GenreConfiguration : IEntityTypeConfiguration<GenreEntity>
{
    public void Configure(EntityTypeBuilder<GenreEntity> builder)
    {
        builder.ToTable("Genres");
        builder.HasKey(g => g.Id);
        
        builder.Property(g => g.Name)
            .HasMaxLength(100)
            .IsRequired();

        builder.HasIndex(g => g.Name)
            .IsUnique();
        
        builder.HasMany(g => g.AnimeGenres)
            .WithOne(ag => ag.Genre)
            .HasForeignKey(ag => ag.GenreId)
            .OnDelete(DeleteBehavior.Cascade);;
    }
}