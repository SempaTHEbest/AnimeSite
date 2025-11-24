using AnimeSite.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AnimeSite.DataAccess.Configurations;

public class WatchHistoryConfiguration : IEntityTypeConfiguration<WatchHistoryEntity>
{
    public void Configure(EntityTypeBuilder<WatchHistoryEntity> builder)
    {
        builder.HasKey(h => new { h.UserId, h.EpisodeId });

        builder.HasOne(h => h.User)
            .WithMany()
            .HasForeignKey(h => h.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(h => h.Episode)
            .WithMany()
            .HasForeignKey(h => h.EpisodeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}