class Map
  include DataMapper::Resource

  # property <name>, <type>
  property :id, Serial
  property :slug, String
  property :title, String
  property :image, String
  property :greetings, Text
  property :starts_here, Boolean, :default => false

  has n, :stories, :constraint => :protect
  has n, :doors_to, :model => "Door", :child_key => [:to_id], :constraint => :destroy
  has n, :doors_from, :model => "Door", :child_key => [:from_id], :constraint => :destroy
  
  def json_summary opts = {}
    json_stories = []
    if opts[:hour]
      json_stories = (
        self.stories.all(:viewable_from => nil) +
        self.stories.all(:viewable_from => 0) +
        self.stories.all(:viewable_from.gte => opts[:hour], :viewable_to.lt => opts[:hour]) +
        self.stories.all(:viewable_from.lt => opts[:hour], :viewable_to.gte => opts[:hour])
      )
    else
      json_stories = self.stories
    end
    {
      :id => self.id,
      :starts_here => self.starts_here,
      :slug => self.slug,
      :title => self.title,
      :image => self.image,
      :greetings => self.greetings.to_s.split("\n"),
      :stories => json_stories.collect {|s| s.json_summary },
      :doors_from => self.doors_from.collect {|d| d.json_summary},
      :doors_to => self.doors_to.collect {|d| d.json_summary}
    }
  end
  
  def self.all_json_summary opts = {}
    {
      :maps => Map.all.collect {|m| m.json_summary opts }
    }
  end
end
