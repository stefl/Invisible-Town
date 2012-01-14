class Story
  include DataMapper::Resource

  property :id, Serial
  property :title, String
  property :description, Text
  property :aframe_clip_id, String
  property :soundcloud_track_id, String
  property :image_url, String
  property :date_happened, Date
  property :time_of_day, Time
  property :viewable_from, Integer
  property :viewable_to, Integer
  property :x, Integer
  property :y, Integer
  belongs_to :map

  has n, :story_maps, :child_key => :story_id, :constraint => :destroy
  has n, :maps, "Map", :through => :story_maps
  has n, :story_stories, :child_key => :story_id, :constraint => :destroy
  has n, :stories, "Story", :through => :story_stories, :via => :reminded_of
  
  def simple_format(text, options={})
    t = options.delete(:tag) || :p
    start_tag = "<p>"
    text = text.to_s.dup
    text.gsub!(/\r\n?/, "\n")                    # \r\n and \r -> \n
    text.gsub!(/\n\n+/, "</#{t}>\n\n#{start_tag}")  # 2+ newline  -> paragraph
    text.gsub!(/([^\n]\n)(?=[^\n])/, '\1<br />') # 1 newline   -> br
    text.insert 0, start_tag
    text << "</#{t}>"
  end
  
  def json_summary
    {
      :id => self.id,
      :title => self.title,
      :aframe_clip_id => self.aframe_clip_id,
      :soundcloud_track_id => self.soundcloud_track_id,
      :image_url => self.image_url,
      :date_happened => self.date_happened,
      :description => self.description,
      :description_html => simple_format(self.description),
      :x => self.x,
      :y => self.y,
      :map => self.map.slug,
      :related_maps => self.maps.collect{|m| {:slug => m.slug, :id => m.id}},
      :related_stories => self.stories.collect{|s| {:map_slug => s.map.slug, :id => s.id}}
    }
  end
end
