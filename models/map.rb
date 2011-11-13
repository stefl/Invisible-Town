class Map
  include DataMapper::Resource

  # property <name>, <type>
  property :id, Serial
  property :slug, String
  property :title, String
  property :image, String

  has n, :stories
  has n, :doors_to, :model => "Door", :child_key => [:to_id]
  has n, :doors_from, :model => "Door", :child_key => [:from_id]
  
  def json_summary
    {
      :id => self.id,
      :slug => self.slug,
      :title => self.title,
      :image => self.image,
      :stories => self.stories.collect {|s| s.json_summary },
      :doors_from => self.doors_from.collect {|d| d.json_summary},
      :doors_to => self.doors_to.collect {|d| d.json_summary}
    }
  end
  
  def self.all_json_summary
    {
      :maps => Map.all.collect {|m| m.json_summary }
    }
  end
end
