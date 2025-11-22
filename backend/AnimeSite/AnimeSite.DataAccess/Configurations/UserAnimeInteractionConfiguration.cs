using AnimeSite.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AnimeSite.DataAccess.Configurations;

public class UserAnimeInteractionConfiguration : IEntityTypeConfiguration<UserAnimeInteractionEntity>
{
    public void Configure(EntityTypeBuilder<UserAnimeInteractionEntity> builder)
    {
        builder.HasKey(i => new { i.UserId, i.AnimeId });

        builder.HasOne(i => i.User)
            .WithMany()
            .HasForeignKey(i => i.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(i => i.Anime)
            .WithMany()
            .HasForeignKey(i => i.AnimeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(i => i.IsWatchLater)
            .HasDefaultValue(false);
        builder.Property(i => i.Rating)
            .IsRequired(false);
    }
}