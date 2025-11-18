using AnimeSite.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AnimeSite.DataAccess.Configurations;

public class EpisodeConfiguration : IEntityTypeConfiguration<EpisodeEntity>
{
    public void Configure(EntityTypeBuilder<EpisodeEntity> builder)
    {
        builder.ToTable("Episodes");
        builder.HasKey(e => e.Id);
        
        builder.Property(e => e.Title)
            .HasMaxLength(200)
            .IsRequired();
            
        builder.Property(e => e.Summary)
            .IsRequired(false);

        builder.Property(e => e.EpisodeLink)
            .HasMaxLength(500)
            .IsRequired(false);

        builder.HasOne(e => e.Anime)
            .WithMany(e => e.Episodes)
            .HasForeignKey(e => e.AnimeId);
    }
}