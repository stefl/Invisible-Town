migration 1, :create_stories do
  up do
    create_table :stories do
      column :id, Integer, :serial => true
      column :title, String, :length => 255
      column :happened_at, DateTime
    end
  end

  down do
    drop_table :stories
  end
end
