from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()


class Interaction(Base):
    __tablename__ = 'interactions'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, default="default")
    user_message = Column(Text, nullable=False)
    assistant_reply = Column(Text, nullable=True)
    redflag = Column(Boolean, default=False)
    redflag_details = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
