class Padrino::Helpers::FormBuilder::AbstractFormBuilder
  # Here we have access to a number of useful variables
  #
  # ** template  (use this to invoke any helpers)(ex. template.hidden_field_tag(...))
  # ** object    (the record for this form) (ex. object.valid?)
  # ** object_name (object's underscored type) (ex. object_name => 'admin_user')
  #
  # We also have access to self.field_types => [:text_field, :text_area, ...]
  # In addition, we have access to all the existing field tag 
  # helpers (text_field, hidden_field, file_field, ...)

  # f.ordering_select :color, :options => ['red', 'green']
  def ordering_select(field, options={})
    options.reverse_merge!(:id => field_id(field), :selected => field_value(field))
    options[:class] = 'ordering_select'
    options.merge!(:class => field_error(field, options))
    @template.select_tag field_name(field), options
  end
    
  # f.text_area :summary, :value => "(enter summary)", :id => 'summary'
  def rich_text_area(field, options={})
    options.reverse_merge!(:value => field_value(field), :id => field_id(field))
    options[:class] = 'rich_text_editor'
    options.merge!(:class => field_error(field, options))
    @template.text_area_tag field_name(field), options
  end
  
  # f.date_field :event_date, :value=>"1985-12-31", :id=> 'date'
  def date_field(field, options={})
    options.reverse_merge!(:value => field_value(field), :id => field_id(field))
    options[:class] = 'date_field'
    options.merge!(:class => field_error(field, options))
    @template.date_field_tag field_name(field), options
  end

  # f.time_field :event_time, :value=>"20:30", :id=> 'date'
  def time_field(field, options={})
    options.reverse_merge!(:value => field_value(field) ? field_value(field).to_time.strftime("%H:%M") : nil, :id => field_id(field))
    options[:class] = 'time_field'
    options.merge!(:class => field_error(field, options))
    @template.time_field_tag field_name(field), options
  end
  
  # f.time_field :event_time, :value=>"20:30", :id=> 'date'
  def number_field(field, options={})
    options.reverse_merge!(:value => field_value(field) ? field_value(field).to_i : nil, :id => field_id(field))
    options[:class] = 'number_field'
    options.merge!(:class => field_error(field, options))
    @template.number_field_tag field_name(field), options
  end

  # f.image_file_field :photo, :class => 'avatar'
  def image_file_field(field, options={})
    options.reverse_merge!(:id => field_id(field))
    options.merge!(:class => field_error(field, options))
    html = ''
    html += @template.file_field_tag field_name(field), options
    if object.send(field).url
      html += "<img src='#{object.send(field).url}' class='image_file_field_thumbnail' alt='#'/>"
    end
    html
  end

   # f.normal_file_field :photo, :class => 'avatar'
  def normal_file_field(field, options={})
    options.reverse_merge!(:id => field_id(field))
    options.merge!(:class => field_error(field, options))
    html = ''
    html += @template.file_field_tag field_name(field), options
    if object.send(field).url
      html += "<span class='normal_file_field_name'>File: #{object.send(field).url}</span>"
    end
    html
  end 

   # f.audio_file_field :photo, :class => 'avatar'
  def audio_file_field(field, options={})
    options.reverse_merge!(:id => field_id(field))
    options.merge!(:class => field_error(field, options))
    html = ''
    html += @template.file_field_tag field_name(field), options
    if object.send(field).url
      html += "<span class='audio_file_field_name'>File: #{object.send(field).url}</span>"
    end
    html
  end 

  def crud_fields(options = {})
    html = ""
    if options[:parent]
      fields = object.class.form_fields(options[:parent])
    else
      fields = object.class.form_fields
    end
    fields.each_with_index do |f, i|
      html << "<p class='#{f[:type]}_type'>"
      html << self.label(f[:label] || f[:name])
      if f[:options]
        html << self.send(f[:type], f[:name], :options=>f[:options])
      elsif f[:options] && f[:include_blank]
        html << self.send(f[:type], f[:name], :options=>f[:options], :include_blank=>f[:include_blank])
      else
        html << self.send(f[:type], f[:name])
      end
      if f[:help]
        html << '<span class="field_help"><a href="return false;">Help</a><span class="jt_content">'+f[:help]+'</span></span>'
      end
      html << "</p>\n"
    end
    html
  end
end