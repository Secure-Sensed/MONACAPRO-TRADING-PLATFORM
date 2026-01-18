from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"

class UserStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"

class User(BaseModel):
    user_id: str
    email: str
    full_name: str
    google_id: Optional[str] = None
    password: Optional[str] = None
    role: UserRole = UserRole.USER
    balance: float = 0.0
    status: UserStatus = UserStatus.ACTIVE
    picture: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserSession(BaseModel):
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime

class RiskLevel(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"

class Trader(BaseModel):
    trader_id: str
    name: str
    image: str
    profit: str
    followers: int
    risk: RiskLevel
    trades: int
    win_rate: str
    is_active: bool = True
    created_at: datetime

class TraderCreate(BaseModel):
    name: str
    image: str
    profit: str
    risk: RiskLevel
    win_rate: str

class CopyTradeStatus(str, Enum):
    ACTIVE = "active"
    STOPPED = "stopped"

class CopyTrade(BaseModel):
    copy_trade_id: str
    user_id: str
    trader_id: str
    amount: float
    started_at: datetime
    ended_at: Optional[datetime] = None
    current_profit: float = 0.0
    status: CopyTradeStatus = CopyTradeStatus.ACTIVE

class CopyTradeCreate(BaseModel):
    trader_id: str
    amount: float

class TransactionType(str, Enum):
    DEPOSIT = "deposit"
    WITHDRAWAL = "withdrawal"
    TRADE = "trade"

class TransactionStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    REJECTED = "rejected"

class Transaction(BaseModel):
    transaction_id: str
    user_id: str
    type: TransactionType
    amount: float
    method: Optional[str] = None
    asset: Optional[str] = None
    status: TransactionStatus = TransactionStatus.PENDING
    date: datetime
    processed_by: Optional[str] = None

class TransactionCreate(BaseModel):
    type: TransactionType
    amount: float
    method: Optional[str] = None

class Plan(BaseModel):
    plan_id: str
    name: str
    price: float
    duration: str
    features: List[str]
    popular: bool = False
    is_active: bool = True
    created_at: datetime

class PlanCreate(BaseModel):
    name: str
    price: float
    duration: str
    features: List[str]
    popular: bool = False

class DashboardStats(BaseModel):
    balance: float
    profit: float
    profit_percentage: float
    active_copies: int
    total_trades: int
