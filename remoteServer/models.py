from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(120), unique=True, nullable=False)
    password = Column(String(120), nullable=False)
    created_at = Column(DateTime, default=func.now())

    configs = relationship('Config', back_populates='user')


class Config(Base):
    __tablename__ = 'configs'
    id = Column(Integer, primary_key=True, autoincrement=True)
    url = Column(String(120), unique=True, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    game_id = Column(Integer, ForeignKey('games.id'), nullable=False)

    user = relationship('User', back_populates='configs')
    game = relationship('Game', back_populates='configs')



class Game(Base):
    __tablename__ = 'games'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(120), unique=True, nullable=False)

    configs = relationship('Config', back_populates='game')
    types = relationship('Type', back_populates='game')

    def toArray(self):
        return {
            "id": self.id,
            "name": self.name
        }

class Type(Base):
    __tablename__ = 'types'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(120), unique=True, nullable=False)
    game_id = Column(Integer, ForeignKey('games.id'), nullable=False)

    game = relationship('Game', back_populates='types')
    versions = relationship('Version', back_populates='type')



class Version(Base):
    __tablename__ = 'versions'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(120), unique=True, nullable=False)
    type_id = Column(Integer, ForeignKey('types.id'), nullable=False)

    type = relationship('Type', back_populates='versions')
    
