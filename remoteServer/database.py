from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base

SessionLocal = None

def init_db(user, host, password, database, port):
    global SessionLocal
    DATABASE_URL = f"mysql+pymysql://{user}:{password}@{host}:{port}/{database}"
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    print("DB Initialized")
    return SessionLocal

def get_db():
    if SessionLocal is None:
        raise Exception("Database not initialized. Call init_db first.")
    
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
