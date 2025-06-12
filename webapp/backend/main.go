package main

import (
    "github.com/gin-gonic/gin"
    "net/http"
)

type Club struct {
    Name     string `json:"name"`
    Password string `json:"password"`
}

type SchoolAffair struct {
    Password string `json:"password"`
}

type Classroom struct {
    Name            string            `json:"name"`
    Capacity        int               `json:"capacity"`
    Status          string            `json:"status"` // 固定/セパ
    AvailablePerDay map[string]string `json:"available_per_day"`
}

// 仮データ
var clubs = []Club{
    {"野球部", "baseball"},
    {"サッカー部", "soccer"},
    {"軽音学部", "lightmusic"},
}
var schoolaffair = SchoolAffair{"admin"}
var classrooms = []Classroom{
    {"C101", 105, "固定", map[string]string{}},
    {"C104", 52, "セパ", map[string]string{}},
    {"C105", 68, "セパ", map[string]string{}},
    {"C106", 102, "セパ", map[string]string{}},
    {"C202", 156, "固定", map[string]string{}},
    {"C203", 73, "固定", map[string]string{}},
    {"C204", 44, "セパ", map[string]string{}},
    {"C205", 105, "固定", map[string]string{}},
    {"C206", 105, "固定", map[string]string{}},
    {"C110", 105, "固定", map[string]string{}},
}

// ログインリクエスト
type LoginRequest struct {
    UserType string `json:"user_type"` // "student" or "admin"
    ClubName string `json:"club_name"` // 学生の場合
    Password string `json:"password"`
}

func main() {
    r := gin.Default()

    // CORS対応（Next.jsと連携する場合は必要）
    r.Use(func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }
        c.Next()
    })

    r.POST("/login", loginHandler)
    r.GET("/clubs", clubsHandler)
    r.GET("/classrooms", classroomsHandler)
    r.PUT("/classrooms/status", updateClassroomStatusHandler)
    r.PUT("/classrooms/status/bulk", updateClassroomStatusBulkHandler)

    r.Run(":8080")
}

// ログインAPI
func loginHandler(c *gin.Context) {
    var req LoginRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
        return
    }
    if req.UserType == "student" {
        for _, club := range clubs {
            if club.Name == req.ClubName && club.Password == req.Password {
                c.JSON(http.StatusOK, gin.H{"result": "ok", "user_type": "student", "club_name": club.Name})
                return
            }
        }
        c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid club or password"})
    } else if req.UserType == "admin" {
        if req.Password == schoolaffair.Password {
            c.JSON(http.StatusOK, gin.H{"result": "ok", "user_type": "admin"})
        } else {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid password"})
        }
    } else {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user type"})
    }
}

// 部活一覧API
func clubsHandler(c *gin.Context) {
    c.JSON(http.StatusOK, clubs)
}

// 教室一覧API
func classroomsHandler(c *gin.Context) {
    c.JSON(http.StatusOK, classrooms)
}

// 教室の利用可否変更API（1日分）
type UpdateStatusRequest struct {
    ClassroomName string `json:"classroom_name"`
    Date          string `json:"date"` // "YYYY-MM-DD"
    Available     string `json:"available"` // "利用可" など
}

func updateClassroomStatusHandler(c *gin.Context) {
    var req UpdateStatusRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
        return
    }
    for i, room := range classrooms {
        if room.Name == req.ClassroomName {
            classrooms[i].AvailablePerDay[req.Date] = req.Available
            c.JSON(http.StatusOK, gin.H{"result": "ok"})
            return
        }
    }
    c.JSON(http.StatusNotFound, gin.H{"error": "classroom not found"})
}

// 教室の利用可否一括変更API（2週間分）
type BulkUpdateStatusRequest struct {
    Updates []UpdateStatusRequest `json:"updates"`
}

func updateClassroomStatusBulkHandler(c *gin.Context) {
    var req BulkUpdateStatusRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
        return
    }
    for _, update := range req.Updates {
        for i, room := range classrooms {
            if room.Name == update.ClassroomName {
                classrooms[i].AvailablePerDay[update.Date] = update.Available
            }
        }
    }
    c.JSON(http.StatusOK, gin.H{"result": "ok"})
}
