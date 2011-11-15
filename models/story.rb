class Story
  include DataMapper::Resource

  # property <name>, <type>
  property :id, Serial
  property :title, String
  property :description, Text
  property :aframe_clip_id, String
  property :soundcloud_track_id, String
  property :date_happened, Date
  property :time_of_day, Time
  property :x, Integer
  property :y, Integer
  belongs_to :map
  
  def json_summary
    {
      :id => self.id,
      :title => self.title,
      :aframe_clip_id => self.aframe_clip_id,
      :soundcloud_track_id => self.soundcloud_track_id,
      :date_happened => self.date_happened,
      :x => self.x,
      :y => self.y,
      :map => self.map.slug
    }
  end
end
