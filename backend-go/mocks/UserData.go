// Code generated by mockery v2.16.0. DO NOT EDIT.

package mocks

import (
	user "groupproject3-airbnb-api/features/user"

	mock "github.com/stretchr/testify/mock"
)

// UserData is an autogenerated mock type for the UserData type
type UserData struct {
	mock.Mock
}

// Deactivate provides a mock function with given fields: userID
func (_m *UserData) Deactivate(userID uint) error {
	ret := _m.Called(userID)

	var r0 error
	if rf, ok := ret.Get(0).(func(uint) error); ok {
		r0 = rf(userID)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// Login provides a mock function with given fields: email
func (_m *UserData) Login(email string) (user.Core, error) {
	ret := _m.Called(email)

	var r0 user.Core
	if rf, ok := ret.Get(0).(func(string) user.Core); ok {
		r0 = rf(email)
	} else {
		r0 = ret.Get(0).(user.Core)
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(string) error); ok {
		r1 = rf(email)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// Profile provides a mock function with given fields: userID
func (_m *UserData) Profile(userID uint) (user.Core, error) {
	ret := _m.Called(userID)

	var r0 user.Core
	if rf, ok := ret.Get(0).(func(uint) user.Core); ok {
		r0 = rf(userID)
	} else {
		r0 = ret.Get(0).(user.Core)
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(uint) error); ok {
		r1 = rf(userID)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// Register provides a mock function with given fields: newUser
func (_m *UserData) Register(newUser user.Core) error {
	ret := _m.Called(newUser)

	var r0 error
	if rf, ok := ret.Get(0).(func(user.Core) error); ok {
		r0 = rf(newUser)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// Update provides a mock function with given fields: userID, updateData
func (_m *UserData) Update(userID uint, updateData user.Core) (user.Core, error) {
	ret := _m.Called(userID, updateData)

	var r0 user.Core
	if rf, ok := ret.Get(0).(func(uint, user.Core) user.Core); ok {
		r0 = rf(userID, updateData)
	} else {
		r0 = ret.Get(0).(user.Core)
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(uint, user.Core) error); ok {
		r1 = rf(userID, updateData)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// UpgradeHost provides a mock function with given fields: userID, approvement
func (_m *UserData) UpgradeHost(userID uint, approvement user.Core) (user.Core, error) {
	ret := _m.Called(userID, approvement)

	var r0 user.Core
	if rf, ok := ret.Get(0).(func(uint, user.Core) user.Core); ok {
		r0 = rf(userID, approvement)
	} else {
		r0 = ret.Get(0).(user.Core)
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(uint, user.Core) error); ok {
		r1 = rf(userID, approvement)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

type mockConstructorTestingTNewUserData interface {
	mock.TestingT
	Cleanup(func())
}

// NewUserData creates a new instance of UserData. It also registers a testing interface on the mock and a cleanup function to assert the mocks expectations.
func NewUserData(t mockConstructorTestingTNewUserData) *UserData {
	mock := &UserData{}
	mock.Mock.Test(t)

	t.Cleanup(func() { mock.AssertExpectations(t) })

	return mock
}
