echo "Configuring ewmsdb"
# check for deleting 
psql -U node_user ewmsdb < ./bin/sql/checkdel.sql
echo "checking for deletion ewmsdb"
#delete the database
dropdb -U node_user ewmsdb
echo "Drop ewmsdb"
# Create a new database
createdb -U node_user ewmsdb
echo "Create new ewmsdb"
# execute sql
psql -U node_user dragonstackdb < ./bin/sql/account.sql