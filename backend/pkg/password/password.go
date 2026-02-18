package password

import (
	"errors"

	"golang.org/x/crypto/bcrypt"
)

const (
	// DefaultCost bcrypt默认成本因子
	DefaultCost = 10
)

var (
	ErrPasswordTooShort = errors.New("password must be at least 6 characters")
	ErrPasswordMismatch = errors.New("password mismatch")
)

// Hash 对密码进行哈希加密
func Hash(password string) (string, error) {
	if len(password) < 6 {
		return "", ErrPasswordTooShort
	}

	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), DefaultCost)
	if err != nil {
		return "", err
	}

	return string(hashedBytes), nil
}

// Verify 验证密码是否匹配
func Verify(hashedPassword, password string) error {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return ErrPasswordMismatch
		}
		return err
	}
	return nil
}

// Validate 验证密码强度
func Validate(password string) error {
	if len(password) < 6 {
		return ErrPasswordTooShort
	}
	// 可以添加更多密码强度验证规则
	return nil
}
