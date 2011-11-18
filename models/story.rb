class Story
  include DataMapper::Resource

  # property <name>, <type>
  property :id, Serial
  property :title, String
  property :description, Text
  property :aframe_clip_id, String
  property :soundcloud_track_id, String
  property :image_url, String
  property :date_happened, Date
  property :time_of_day, Time
  property :x, Integer
  property :y, Integer
  belongs_to :map
  
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
      :date_happened => self.date_happened,
      :description => self.description,
      :description_html => simple_format(self.description),
      :x => self.x,
      :y => self.y,
      :map => self.map.slug
    }
  end
end
