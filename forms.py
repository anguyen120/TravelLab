from datetime import date

from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.fields.html5 import DateField
from wtforms.validators import DataRequired


class Form(FlaskForm):
    from_location = StringField('From', [
        DataRequired()])
    to_location = StringField('To', [
        DataRequired()])
    depart_date = DateField('Depart',
                            default=date.today)
    return_date = DateField('Return',
                            default=date.today)
    submit = SubmitField('Submit')
    '''
    def validate_on_submit(self):
        result = super(Form, self).validate()
        if self.depart_date.data > self.return_date.data:
            return False
        else:
            return result
    '''
