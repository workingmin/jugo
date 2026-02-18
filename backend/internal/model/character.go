package model

// CharacterRole 角色类型
type CharacterRole string

const (
	CharacterRoleProtagonist CharacterRole = "protagonist" // 主角
	CharacterRoleAntagonist  CharacterRole = "antagonist"  // 反派
	CharacterRoleSupporting  CharacterRole = "supporting"  // 配角
)

// Character 角色模型
type Character struct {
	BaseModel
	WorkID      uint          `gorm:"not null;index" json:"workId"`
	Name        string        `gorm:"type:varchar(100);not null;index" json:"name"`
	Role        CharacterRole `gorm:"type:varchar(50)" json:"role"`
	Description string        `gorm:"type:text" json:"description"`

	// 关联
	Work Work `gorm:"foreignKey:WorkID" json:"-"`
}

// TableName 指定表名
func (Character) TableName() string {
	return "characters"
}
