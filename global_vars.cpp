#include "common.h"

// グローバル変数の定義
vector<club> clubs = {
    {"野球部", "baseball"}, 
    {"サッカー部", "soccer"}, 
    {"軽音学部", "lightmusic"}
};

schoolAffair schoolaffair = {"admin"};
currentUserState userState; 

vector<classroom> classrooms = {
    {"C101", 105, "固定", {}},
    {"C104", 52, "セパ", {}},
    {"C105", 68, "セパ", {}},
    {"C106", 102, "セパ", {}},
    {"C202", 156, "固定", {}},
    {"C203", 73, "固定", {}},
    {"C204", 44, "セパ", {}},
    {"C205", 105, "固定", {}},
    {"C206", 105, "固定", {}},
    {"C110", 105, "固定", {}}
};