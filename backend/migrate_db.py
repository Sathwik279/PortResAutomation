import os
from sqlalchemy import create_engine, text

DATABASE_URL = "mysql+pymysql://2HLprKhDRWohK2c.root:9t4QQqSStBDmEF0g@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?ssl_verify_cert=true&ssl_verify_identity=true"

engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    print("Checking if user_id column exists...")
    # Add user_id column if it doesn't exist
    try:
        conn.execute(text("ALTER TABLE configs ADD COLUMN user_id VARCHAR(128) AFTER id"))
        conn.execute(text("CREATE INDEX ix_configs_user_id ON configs (user_id)"))
        conn.commit()
        print("Success: user_id column added to configs table.")
    except Exception as e:
        if "Duplicate column name" in str(e):
            print("Column already exists.")
        else:
            print(f"Error: {e}")
