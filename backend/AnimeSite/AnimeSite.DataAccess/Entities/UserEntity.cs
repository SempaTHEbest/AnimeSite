namespace AnimeSite.DataAccess.Entities;

public class UserEntity
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; } = string.Empty;
    public string GoogleId { get; set; } = string.Empty;
    public int RoleId { get; set; }
}