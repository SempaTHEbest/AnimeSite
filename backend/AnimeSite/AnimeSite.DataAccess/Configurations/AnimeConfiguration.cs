using AnimeSite.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AnimeSite.DataAccess.Configurations;

public class AnimeConfiguration : IEntityTypeConfiguration<AnimeEntity>
{
    public void Configure(EntityTypeBuilder<AnimeEntity> builder)
    {
        builder.ToTable("Anime");
        builder.HasKey(a => a.Id);
        
        builder.Property(a => a.Title)
            .HasMaxLength(100)
            .IsRequired();
        builder.Property(a => a.Description)
            .IsRequired();
        builder.Property(a => a.ImageUrl)
            .HasMaxLength(500)
            .IsRequired();
        builder.Property(a => a.Studio)
            .HasMaxLength(100)
            .IsRequired();
        builder.Property(a => a.Status)
            .HasMaxLength(100)
            .IsRequired();
        builder.Property(a => a.Type)
            .HasMaxLength(100)
            .IsRequired();
        
        //Зв'язки
        
        builder.HasMany(a => a.Episodes)
            .WithOne(e => e.Anime)
            .HasForeignKey(e => e.AnimeId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasMany(a => a.AnimeGenres)
            .WithOne(e => e.Anime)
            .HasForeignKey(e => e.AnimeId)
            .OnDelete(DeleteBehavior.Cascade);;
    }
}