class Door
  include DataMapper::Resource

  # property <name>, <type>
  property :id, Serial
  property :x, Integer
  property :y, Integer
  
  belongs_to :from, "Map", :key => true
  belongs_to :to, "Map", :key => true
  
  def json_summary
    {
      :id => self.id,
      :from => self.from.slug,
      :to => self.to.slug,
      :x => self.x,
      :y => self.y
    }
  end
end
