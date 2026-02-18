package service

import (
	"errors"

	"github.com/jugo/backend/internal/dto"
	"github.com/jugo/backend/internal/model"
	"github.com/jugo/backend/internal/repository"
)

var (
	ErrCharacterNotFound = errors.New("character not found")
)

// CharacterService 角色服务接口
type CharacterService interface {
	Create(userID, workID uint, req *dto.CreateCharacterRequest) (*dto.CharacterResponse, error)
	GetByID(userID, characterID uint) (*dto.CharacterResponse, error)
	List(userID, workID uint) (*dto.CharacterListResponse, error)
	Update(userID, characterID uint, req *dto.UpdateCharacterRequest) (*dto.CharacterResponse, error)
	Delete(userID, characterID uint) error
}

// characterService 角色服务实现
type characterService struct {
	workRepo      repository.WorkRepository
	characterRepo repository.CharacterRepository
}

// NewCharacterService 创建角色服务
func NewCharacterService(workRepo repository.WorkRepository, characterRepo repository.CharacterRepository) CharacterService {
	return &characterService{
		workRepo:      workRepo,
		characterRepo: characterRepo,
	}
}

// Create 创建角色
func (s *characterService) Create(userID, workID uint, req *dto.CreateCharacterRequest) (*dto.CharacterResponse, error) {
	// 验证作品权限
	work, err := s.workRepo.FindByID(workID)
	if err != nil {
		return nil, err
	}
	if work.UserID != userID {
		return nil, ErrUnauthorized
	}

	// 创建角色
	character := &model.Character{
		WorkID:      workID,
		Name:        req.Name,
		Role:        model.CharacterRole(req.Role),
		Description: req.Description,
	}

	if err := s.characterRepo.Create(character); err != nil {
		return nil, err
	}

	return s.toCharacterResponse(character), nil
}

// GetByID 获取角色详情
func (s *characterService) GetByID(userID, characterID uint) (*dto.CharacterResponse, error) {
	// 获取角色
	character, err := s.characterRepo.FindByID(characterID)
	if err != nil {
		return nil, err
	}

	// 验证作品权限
	work, err := s.workRepo.FindByID(character.WorkID)
	if err != nil {
		return nil, err
	}
	if work.UserID != userID {
		return nil, ErrUnauthorized
	}

	return s.toCharacterResponse(character), nil
}

// List 获取角色列表
func (s *characterService) List(userID, workID uint) (*dto.CharacterListResponse, error) {
	// 验证作品权限
	work, err := s.workRepo.FindByID(workID)
	if err != nil {
		return nil, err
	}
	if work.UserID != userID {
		return nil, ErrUnauthorized
	}

	// 获取角色列表
	characters, err := s.characterRepo.FindByWorkID(workID)
	if err != nil {
		return nil, err
	}

	// 转换为响应格式
	items := make([]dto.CharacterListItem, len(characters))
	for i, character := range characters {
		items[i] = dto.CharacterListItem{
			CharacterID: character.ID,
			WorkID:      character.WorkID,
			Name:        character.Name,
			Role:        string(character.Role),
			Description: character.Description,
			CreatedAt:   character.CreatedAt,
			UpdatedAt:   character.UpdatedAt,
		}
	}

	return &dto.CharacterListResponse{
		Characters: items,
	}, nil
}

// Update 更新角色
func (s *characterService) Update(userID, characterID uint, req *dto.UpdateCharacterRequest) (*dto.CharacterResponse, error) {
	// 获取角色
	character, err := s.characterRepo.FindByID(characterID)
	if err != nil {
		return nil, err
	}

	// 验证作品权限
	work, err := s.workRepo.FindByID(character.WorkID)
	if err != nil {
		return nil, err
	}
	if work.UserID != userID {
		return nil, ErrUnauthorized
	}

	// 更新字段
	if req.Name != "" {
		character.Name = req.Name
	}
	if req.Role != "" {
		character.Role = model.CharacterRole(req.Role)
	}
	if req.Description != "" {
		character.Description = req.Description
	}

	if err := s.characterRepo.Update(character); err != nil {
		return nil, err
	}

	return s.toCharacterResponse(character), nil
}

// Delete 删除角色
func (s *characterService) Delete(userID, characterID uint) error {
	// 获取角色
	character, err := s.characterRepo.FindByID(characterID)
	if err != nil {
		return err
	}

	// 验证作品权限
	work, err := s.workRepo.FindByID(character.WorkID)
	if err != nil {
		return err
	}
	if work.UserID != userID {
		return ErrUnauthorized
	}

	// 删除角色
	return s.characterRepo.Delete(characterID)
}

// toCharacterResponse 转换为角色响应
func (s *characterService) toCharacterResponse(character *model.Character) *dto.CharacterResponse {
	return &dto.CharacterResponse{
		CharacterID: character.ID,
		WorkID:      character.WorkID,
		Name:        character.Name,
		Role:        string(character.Role),
		Description: character.Description,
		CreatedAt:   character.CreatedAt,
		UpdatedAt:   character.UpdatedAt,
	}
}
