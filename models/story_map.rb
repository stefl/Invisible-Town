class StoryMap
  include DataMapper::Resource

  belongs_to :story, 'Story', :key => true
  belongs_to :map, 'Map', :key => true
 end