class Story
  include DataMapper::Resource

  # property <name>, <type>
  property :id, Serial
  property :title, String
  property :post_id, String
  property :happened_at, DateTime
  property :x, Integer
  property :y, Integer
  belongs_to :map
  
  def json_summary
    {
      :id => self.id,
      :title => self.title,
      :post_id => self.post_id,
      :happened_at => self.happened_at,
      :x => self.x,
      :y => self.y,
      :map => self.map.slug
    }
  end
end
