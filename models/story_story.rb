class StoryStory
  include DataMapper::Resource

  belongs_to :story, 'Story', :key => true
  belongs_to :reminded_of, 'Story', :key => true
 end