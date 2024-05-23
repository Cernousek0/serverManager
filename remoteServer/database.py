from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base

def init_db(user,host,password,database,port):

    DATABASE_URL = f"mysql+pymysql://{user}:{password}@{host}:{port}/{database}"
    engine = create_engine(DATABASE_URL)
    # SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    # Base.metadata.create_all(bind=engine)
    print("DB Initialized")